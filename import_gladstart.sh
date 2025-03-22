#!/bin/bash
# Simplified script to import GLADSTART articles without requiring file renaming

# Set paths
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BACKEND_DIR="backend"
IMAGES_DIR="images_to_import"
JSON_FILE="gladstart_articles.json"

# Create the necessary directories
mkdir -p "$IMAGES_DIR"
mkdir -p "$BACKEND_DIR/media/article_pictures"
mkdir -p "$BACKEND_DIR/api/management/commands"

# Create the management command file
cat > "$BACKEND_DIR/api/management/commands/import_gladstart_articles.py" << 'EOF'
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
EOF
echo "Created Django management command."

# Create the JSON file with article data
cat > "$JSON_FILE" << 'EOF'
{
  "title": "Vårens ljusglimtar 😊 Från teaterhjältar till idrottsgåvor! ✨",
  "date": "24th March 2025",
  "stories": [
    {
      "title": "Ålder är bara en siffra - passion vet inga gränser! 👵 🎭",
      "content": "Inga Gustafsson, 85 år, bevisar att man aldrig är för gammal för att följa sina drömmar! Efter 17 år med teatergruppen \"Berguvarna\" turnerar hon nu med föreställningen \"Återvinning\" för att inspirera andra äldre. \"Man slutar inte leka för att man blir gammal, man blir gammal för att man slutar leka,\" säger Inga med ett leende. Och det är precis denna lekfulla inställning till livet som fortsätter genom dagens berättelser! 💖",
      "source": "svt.se",
      "emoji": "👵 🎭",
      "link": "https://www.svt.se/nyheter/lokalt/sodertalje/inga-85-aker-pa-turne-vill-inspirera-andra-aldre-att-borja-med-teater",
      "image": "inga_teater_85.jpg"
    },
    {
      "title": "Från scenen till idrottsarenan - när en person gör skillnad! 🏆 🏀",
      "content": "Precis som Inga använder teatern för att sprida glädje, har mångmiljardären Torsten Jansson hittat sitt sätt att göra skillnad. Han har investerat otroliga 200 miljoner kronor i en multiarena på 10 000 kvadratmeter i lilla Kosta! \"Det fanns inget för ungdomar att göra,\" förklarar Torsten, som själv har bakgrund som pingisspelare. När reportern frågade vad han vinner på det hela svarade han enkelt: \"Inget annat än glädje.\" Samma glädje som Inga finner i teatern, finner Torsten i att ge ungdomar en meningsfull fritid! 🙌",
      "source": "svt.se",
      "emoji": "🏆 🏀",
      "link": "https://www.svt.se/nyheter/lokalt/smaland/torsten-jansson-vill-skapa-idrottscentrum-i-kosta-investerar-200-miljoner",
      "image": "torsten_arena_kosta.jpg"
    },
    {
      "title": "Generositet som botar - från idrott till medicin! 🩺 ✨",
      "content": "Medan Torsten investerar i fysisk hälsa genom idrott, kommer nu fantastiska nyheter inom medicinsk forskning! Tyska forskare har åstadkommit något som länge ansetts omöjligt - fem patienter med den autoimmuna sjukdomen SLE har blivit helt symptomfria efter genteknikbehandling! Detta genombrott visar att samma typ av engagemang som Torsten och Inga uppvisar, när det appliceras inom forskning, kan leda till livräddande genombrott! 🧬 💫",
      "source": "svd.se",
      "emoji": "🩺 ✨",
      "link": "https://www.svd.se/a/0VJzB0/en-rad-genombrott-ger-hopp-mot-autoimmuna-sjukdomarna-sle-och-ms",
      "image": "sle_breakthrough_research.jpg"
    },
    {
      "title": "En stjärnas jordnära handling - från medicinsk till ekonomisk frihet! 🌈 💸",
      "content": "Precis som forskarna använder sin expertis för att befria patienter från sjukdom, har skådespelaren Michael Sheen använt sin förmögenhet för att befria 900 personer från ekonomisk börda! Med 100 000 pund köpte han upp skulder i sin hemstad Port Talbot, där många drabbats av arbetslöshet efter att ortens stålverk lagts ner. \"Det blev som ett slag i magen,\" berättar Michael om när han hörde om situationen. Hans kreativa lösning på problemet visar att medkänsla, likt Ingas teater och Torstens arena, kan ta många former! 👏",
      "source": "aftonbladet.se",
      "emoji": "🌈 💸",
      "link": "https://www.aftonbladet.se/nojesbladet/a/W0Bva2/stjarnan-gjorde-900-personer-skuldfria",
      "image": "michael_sheen_debt.jpg"
    },
    {
      "title": "Kärlek i överflöd - från människor till hundar! 🐕 ❤️",
      "content": "När vi talar om medkänsla och kärlek - ett viralt klipp från ett hunddagis i Kina visar precis hur överflödande kärlek kan vara! När en anställd snubblade överöstes personen med hundkärlek istället för ilska. Precis som Michael Sheens generositet, Torstens investeringar och Ingas engagemang, påminner oss hundarna om kraften i ovillkorlig kärlek och glädje! 🌍 🐾",
      "source": "expressen.se",
      "emoji": "🐕 ❤️",
      "link": "https://www.expressen.se/tv/nyheter/varlden/snubblar-pa-hunden-blir-overost-med-karlek/",
      "image": "doggy_daycare_love.jpg"
    },
    {
      "title": "Från vardagshjältar till idrottshjältar! ⚽ 🏆",
      "content": "Talang och envishet lönar sig - precis som för alla våra vardagshjältar ovan! Svenska Alexander Isak blev matchhjälte när Newcastle bröt sin 70-åriga titeltorka med seger i ligacupfinalen mot Liverpool. \"Alexander Isak cementerar sin plats i Newcastles sägner,\" rapporterade BBC. På samma sätt som Inga, Torsten, forskarna och Michael skriver historia inom sina områden, skapade Isak ett historiskt ögonblick på fotbollsplanen! 🇸🇪 👑",
      "source": "omni.se",
      "emoji": "⚽ 🏆",
      "link": "https://omni.se/isak-hjalte-nar-newcastle-tog-historisk-seger/a/76eB6E",
      "image": "isak_newcastle_victory.jpg"
    },
    {
      "title": "Kärlekens uthållighet - den ultimata framgångssagan! 💕 👴👵",
      "content": "Och när vi talar om uthållighet - det brasilianska paret Manoel (105) och Maria (101) har just slagit världsrekord i längsta äktenskapet med otroliga 84 år tillsammans! Likt Inga som återvände till teatern efter livets alla plikter, visar paret att kärlek och engagemang bara växer sig starkare med åren. Deras hemlighet? \"Kärlek\", säger Maria enkelt. Samma kärlek som driver alla våra berättelser idag! 💝",
      "source": "people.com",
      "emoji": "💕 👴👵",
      "link": "https://people.com/brazilian-couple-who-just-broke-record-for-longest-living-marriage-in-history-shares-secret-to-happy-union-11685081",
      "image": "brazilian_couple_record.jpg"
    },
    {
      "title": "En kopp hälsa till allt detta! 🧠 ☕",
      "content": "Och medan du läser om alla dessa inspirerande människor, varför inte njuta av en kopp kaffe? Ny forskning visar att kaffedrickande kan minska risken för alzheimers och parkinsons med hela 30 procent! Bäst effekt ger osötat kaffe med koffein - ytterligare en anledning att ta en paus och reflektera över dagens goda nyheter med en värmande kopp i handen! ☕ 😊",
      "source": "aftonbladet.se",
      "emoji": "🧠 ☕",
      "link": "https://www.aftonbladet.se/halsa/a/3MKxV0/kaffe-kan-minska-risken-for-alzheimers-och-parkinson",
      "image": "coffee_brain_health.jpg"
    }
  ]
}
EOF
echo "Created JSON file with article data."

# Ask user to copy images
echo ""
echo "===================================================================="
echo "INSTRUCTIONS:"
echo "1. Please copy all your article images to the '$IMAGES_DIR' folder."
echo "2. You don't need to rename the images - the script will match them automatically."
echo "3. The script will copy them to the Django media directory."
echo ""
read -p "Press Enter when you've placed your images in the '$IMAGES_DIR' folder... " -n1 -s
echo ""

# Check if any images exist
if [ ! -d "$IMAGES_DIR" ] || [ -z "$(ls -A "$IMAGES_DIR" 2>/dev/null)" ]; then
    echo "Warning: No images found in the $IMAGES_DIR directory."
    read -p "Do you want to continue without images? (y/n): " -n1 CONTINUE
    echo ""
    if [ "$CONTINUE" != "y" ]; then
        echo "Import aborted. Please add images to $IMAGES_DIR and try again."
        exit 1
    fi
else
    # Copy all images to the media directory
    echo "Copying images to Django media directory..."
    cp "$IMAGES_DIR"/* "$BACKEND_DIR/media/article_pictures/"
    echo "Copied $(ls -A "$IMAGES_DIR" | wc -l) images to the Django media directory."
fi

# Run the Django management command to import the articles
echo "Running the Django management command to import the articles..."
cd "$BACKEND_DIR"
python manage.py import_gladstart_articles "../$JSON_FILE" --images_dir="../$IMAGES_DIR"

echo ""
echo "Import process completed!"
echo "You can now check your admin interface to see the imported articles."