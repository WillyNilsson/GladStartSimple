# backend/api/management/commands/import_gladstart_articles.py
import os
import json
import datetime
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.conf import settings
from django.utils.text import slugify
from django.utils import timezone
from api.models import Region, Source, Topic, Article, UserPost

class Command(BaseCommand):
    help = 'Import GLADSTART articles from a JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Path to the JSON file containing articles')
        parser.add_argument('--images_dir', type=str, help='Directory containing article images', default='')

    def handle(self, *args, **options):
        json_file = options['json_file']
        images_dir = options['images_dir']

        if not os.path.exists(json_file):
            self.stdout.write(self.style.ERROR(f'JSON file does not exist: {json_file}'))
            return

        # Load the JSON data
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Get list of available images
        available_images = {}
        if images_dir and os.path.exists(images_dir):
            for filename in os.listdir(images_dir):
                if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                    available_images[filename] = os.path.join(images_dir, filename)
            self.stdout.write(f'Found {len(available_images)} images in {images_dir}')

        # Process the newsletter data
        self.import_articles(data, available_images)

    def import_articles(self, data, available_images):
        self.stdout.write('Importing articles...')

        # Get regions or create default region
        regions = list(Region.objects.all())
        if not regions:
            # Create default regions if none exist
            default_regions = [
                {'name': 'National', 'positivity': 0.83, 'articles_count': 0},
                {'name': 'Stockholm', 'positivity': 0.82, 'articles_count': 0},
                {'name': 'Uppsala', 'positivity': 0.85, 'articles_count': 0}
            ]
            for region_data in default_regions:
                region = Region.objects.create(**region_data)
                regions.append(region)
                self.stdout.write(f'Created default region: {region.name}')
        
        # Default region (National)
        default_region = next((r for r in regions if r.name == 'National'), regions[0])

        # Process each story in the newsletter
        for i, story in enumerate(data.get('stories', [])):
            # Get or create source
            source_name = story.get('source', 'Unknown')
            source, created = Source.objects.get_or_create(name=source_name)
            if created:
                self.stdout.write(f'Created source: {source.name}')

            # Get article title and check if it already exists
            title = story.get('title', '')
            if Article.objects.filter(title=title).exists():
                self.stdout.write(f'Article already exists: {title}')
                continue

            # Select an image if available
            selected_image = None
            image_url = '/placeholder.svg?height=400&width=600'  # Default fallback

            # Try to match the image from the article data
            specified_image = story.get('image', '')
            
            # If we have matching image, use it
            if specified_image and specified_image in available_images:
                selected_image = available_images[specified_image]
            else:
                # Otherwise, use any available image based on index
                image_files = list(available_images.values())
                if i < len(image_files):
                    selected_image = image_files[i]
            
            # Set a positivity score based on the index (just for demonstration)
            positivity_scores = [0.92, 0.87, 0.89, 0.85, 0.83, 0.81, 0.90, 0.79]
            positivity_score = positivity_scores[i % len(positivity_scores)]
            
            # Choose a region (rotate through available regions)
            region = regions[i % len(regions)]

            # Create article with basic data
            article = Article(
                title=title,
                summary=story.get('content', ''),
                source=source,
                published_date=timezone.now(),
                positivity_score=positivity_score,
                region=region,
                image_url=image_url,
                url=story.get('link', '')
            )
            article.save()
            
            # Process image if available
            if selected_image:
                image_filename = os.path.basename(selected_image)
                # Just update the image URL since we already copied the files
                article.image_url = f'/media/article_pictures/{image_filename}'
                article.save()
                self.stdout.write(f'Associated image: {image_filename} with article: {title}')

            # Extract potential topics from content
            content = story.get('content', '')
            
            # Create some topics based on content analysis
            keywords = {
                'teater': 'Kultur',
                'idrott': 'Sport', 
                'sport': 'Sport',
                'medicin': 'Hälsa',
                'forskning': 'Forskning', 
                'ekonomi': 'Ekonomi',
                'hälsa': 'Hälsa',
                'kärlek': 'Relationer',
                'djur': 'Djur',
                'miljö': 'Miljö',
                'utbildning': 'Utbildning',
                'arbetsmarknad': 'Arbetsmarknad',
                'skola': 'Utbildning'
            }
            
            topics_added = []
            for keyword, category in keywords.items():
                if keyword.lower() in content.lower() and category not in topics_added:
                    topic, created = Topic.objects.get_or_create(name=category)
                    article.topics.add(topic)
                    topics_added.append(category)
                    if created:
                        self.stdout.write(f'Created topic: {topic.name}')
            
            # Add the default topic if none were found
            if not topics_added:
                default_topic, created = Topic.objects.get_or_create(name='Positiva nyheter')
                article.topics.add(default_topic)
                if created:
                    self.stdout.write(f'Created default topic: {default_topic.name}')
            
            # Update the article count for the region
            region.articles_count = region.articles_count + 1
            region.save()
            
            self.stdout.write(self.style.SUCCESS(f'Created article: {article.title}'))

        self.stdout.write(self.style.SUCCESS('Successfully imported articles!'))
