import json
import datetime
from django.core.management.base import BaseCommand
from api.models import Region, Source, Topic, Article, UserPost

class Command(BaseCommand):
    help = 'Load initial data for the GladStart app'

    def handle(self, *args, **kwargs):
        self.stdout.write('Loading initial data...')
        
        # Create Regions
        self.stdout.write('Creating regions...')
        regions_data = [
            {'name': 'Uppland', 'positivity': 0.91, 'articles_count': 98},
            {'name': 'Skåne', 'positivity': 0.79, 'articles_count': 156},
            {'name': 'Småland', 'positivity': 0.81, 'articles_count': 68},
            {'name': 'Halland', 'positivity': 0.84, 'articles_count': 65},
            {'name': 'Närke', 'positivity': 0.77, 'articles_count': 62},
            {'name': 'Dalarna', 'positivity': 0.75, 'articles_count': 58},
            {'name': 'Blekinge', 'positivity': 0.8, 'articles_count': 45},
            {'name': 'Stockholm', 'positivity': 0.82, 'articles_count': 120},
            {'name': 'Västra Götaland', 'positivity': 0.85, 'articles_count': 110},
            {'name': 'Kronoberg', 'positivity': 0.78, 'articles_count': 55},
            {'name': 'Norrbotten', 'positivity': 0.87, 'articles_count': 70},
            {'name': 'National', 'positivity': 0.83, 'articles_count': 200},
            {'name': 'Uppsala', 'positivity': 0.89, 'articles_count': 85},
        ]
        
        regions = {}
        for region_data in regions_data:
            region, created = Region.objects.get_or_create(
                name=region_data['name'],
                defaults={
                    'positivity': region_data['positivity'],
                    'articles_count': region_data['articles_count']
                }
            )
            regions[region.name] = region
            if created:
                self.stdout.write(f'Created region: {region.name}')
        
        # Create Sources
        self.stdout.write('Creating sources...')
        sources_data = [
            {'name': 'Svenska Dagbladet'},
            {'name': 'Dagens Nyheter'},
            {'name': 'SVT Nyheter'},
            {'name': 'Sveriges Radio'},
            {'name': 'Göteborgs-Posten'},
            {'name': 'Sydsvenskan'},
            {'name': 'Aftonbladet'},
            {'name': 'Expressen'},
            {'name': 'Dagens Industri'},
            {'name': 'Computer Sweden'},
            {'name': 'Breakit'},
        ]
        
        sources = {}
        for source_data in sources_data:
            source, created = Source.objects.get_or_create(name=source_data['name'])
            sources[source.name] = source
            if created:
                self.stdout.write(f'Created source: {source.name}')
        
        # Create Topics
        self.stdout.write('Creating topics...')
        topics_data = [
            {'name': 'Miljö'},
            {'name': 'Forskning'},
            {'name': 'Innovation'},
            {'name': 'Hälsa'},
            {'name': 'Ekonomi'},
            {'name': 'Mode'},
            {'name': 'Transport'},
            {'name': 'Utbildning'},
            {'name': 'Arbetsmarknad'},
            {'name': 'Industri'},
            {'name': 'Integration'},
        ]
        
        topics = {}
        for topic_data in topics_data:
            topic, created = Topic.objects.get_or_create(name=topic_data['name'])
            topics[topic.name] = topic
            if created:
                self.stdout.write(f'Created topic: {topic.name}')
        
        # Create Articles
        self.stdout.write('Creating articles...')
        articles_data = [
            {
                'title': 'Genombrott i svensk forskning kring förnybar energi',
                'summary': 'Forskare vid Uppsala universitet har utvecklat en ny metod för att lagra solenergi med 40% högre effektivitet än tidigare teknik. Detta kan revolutionera hur vi använder solenergi i framtiden och göra förnybara energikällor mer tillgängliga för alla.',
                'source': 'SVT Nyheter',
                'published_date': '2025-03-11T16:24:00Z',
                'positivity_score': 0.92,
                'topics': ['Miljö', 'Forskning', 'Innovation'],
                'region': 'Uppsala',
                'image_url': '/placeholder.svg?height=400&width=600',
                'url': 'https://www.svt.se/nyheter/artikel/12345'
            },
            {
                'title': 'Nya vårdmetoden minskar väntetiden för patienter med 70 procent',
                'summary': 'En innovativ arbetsmodell vid Sahlgrenska Universitetssjukhuset har kraftigt reducerat väntetiden för patienter samtidigt som vårdpersonalens arbetsmiljö förbättrats. Modellen kommer nu att implementeras på fler sjukhus runt om i landet.',
                'source': 'Göteborgs-Posten',
                'published_date': '2025-03-12T09:15:00Z',
                'positivity_score': 0.87,
                'topics': ['Hälsa', 'Innovation'],
                'region': 'Västra Götaland',
                'image_url': '/placeholder.svg?height=400&width=600',
                'url': 'https://www.gp.se/nyheter/artikel/67890'
            },
            {
                'title': 'Svensk startup säkrar miljardinvestering: "Kommer förändra hållbart mode"',
                'summary': 'Stockholmsbaserade Re:Textile har utvecklat en teknik för 100% återvinning av textilier. Nu investerar internationella aktörer över en miljard kronor i företaget. Detta kan leda till en revolution inom modeindustrin och drastiskt minska dess miljöpåverkan.',
                'source': 'Breakit',
                'published_date': '2025-03-12T07:30:00Z',
                'positivity_score': 0.89,
                'topics': ['Miljö', 'Ekonomi', 'Mode'],
                'region': 'Stockholm',
                'image_url': '/placeholder.svg?height=400&width=600',
                'url': 'https://www.breakit.se/artikel/24680'
            },
            {
                'title': 'Småländsk kommun först i landet med 100% fossilfri kollektivtrafik',
                'summary': 'Växjö kommun har nått sitt mål om helt fossilfri kollektivtrafik fem år före tidsplanen. Kommunen använder nu en kombination av eldrivna bussar och biogas. Projektet har väckt internationell uppmärksamhet och flera delegationer från andra länder har besökt Växjö för att lära sig mer.',
                'source': 'SVT Nyheter',
                'published_date': '2025-03-11T14:12:00Z',
                'positivity_score': 0.85,
                'topics': ['Miljö', 'Transport'],
                'region': 'Kronoberg',
                'image_url': '/placeholder.svg?height=400&width=600',
                'url': 'https://www.svt.se/nyheter/artikel/13579'
            },
            {
                'title': 'Svenska elevresultat visar stark uppgång i internationella mätningar',
                'summary': 'De senaste PISA-resultaten visar att svenska elever presterar allt bättre i matematik och naturvetenskap, med kraftig förbättring sedan förra mätningen. Sverige klättrar nu flera placeringar i den internationella rankingen och närmar sig topp 10.',
                'source': 'Dagens Nyheter',
                'published_date': '2025-03-10T18:45:00Z',
                'positivity_score': 0.83,
                'topics': ['Utbildning'],
                'region': 'National',
                'image_url': '/placeholder.svg?height=400&width=600',
                'url': 'https://www.dn.se/artikel/24680'
            },
            {
                'title': 'Arbetslösheten i Sverige sjunker till lägsta nivån på 15 år',
                'summary': 'Nya siffror från Arbetsförmedlingen visar att arbetslösheten i Sverige nu är nere på 4,2 procent, den lägsta nivån sedan 2010. Särskilt positiv är utvecklingen bland unga och utrikesfödda, där arbetslösheten minskat markant under det senaste året.',
                'source': 'Svenska Dagbladet',
                'published_date': '2025-03-12T10:30:00Z',
                'positivity_score': 0.81,
                'topics': ['Ekonomi', 'Arbetsmarknad'],
                'region': 'National',
                'image_url': '/placeholder.svg?height=400&width=600',
                'url': 'https://www.svd.se/artikel/97531'
            },
            {
                'title': 'Norrbotten blir centrum för grön industri: "Global förebild"',
                'summary': 'Med H2 Green Steel, LKAB:s fossilfria järnsvamp och nu batterifabriker är Norrbotten på väg att bli ett internationellt centrum för grön industri. Regionen förväntas skapa tusentals nya jobb och locka internationell expertis under de kommande åren.',
                'source': 'Sveriges Radio',
                'published_date': '2025-03-11T11:20:00Z',
                'positivity_score': 0.9,
                'topics': ['Miljö', 'Ekonomi', 'Industri'],
                'region': 'Norrbotten',
                'image_url': '/placeholder.svg?height=400&width=600',
                'url': 'https://www.sverigesradio.se/artikel/86420'
            },
            {
                'title': 'Svensk modell för integration väcker internationell uppmärksamhet',
                'summary': 'Ett projekt i Malmö som kombinerar språkutbildning med arbetsplatsförlagd praktik har gett remarkabla resultat och studeras nu internationellt. Över 80% av deltagarna har fått jobb inom sex månader efter avslutat program, vilket är långt över genomsnittet för liknande insatser.',
                'source': 'Sydsvenskan',
                'published_date': '2025-03-10T15:40:00Z',
                'positivity_score': 0.79,
                'topics': ['Integration', 'Arbetsmarknad'],
                'region': 'Skåne',
                'image_url': '/placeholder.svg?height=400&width=600',
                'url': 'https://www.sydsvenskan.se/artikel/75319'
            }
        ]
        
        for article_data in articles_data:
            # Check if article already exists (based on title and source)
            source = sources[article_data['source']]
            region = regions[article_data['region']]
            
            article, created = Article.objects.get_or_create(
                title=article_data['title'],
                source=source,
                defaults={
                    'summary': article_data['summary'],
                    'published_date': article_data['published_date'],
                    'positivity_score': article_data['positivity_score'],
                    'region': region,
                    'image_url': article_data['image_url'],
                    'url': article_data['url']
                }
            )
            
            if created:
                # Add topics
                for topic_name in article_data['topics']:
                    article.topics.add(topics[topic_name])
                self.stdout.write(f'Created article: {article.title}')
        
        # Create UserPosts
        self.stdout.write('Creating user posts...')
        posts_data = [
            {
                'username': 'AnnaS',
                'avatar': '/placeholder.svg?height=40&width=40',
                'date': '2025-03-14T08:30:00Z',
                'title': 'Fantastisk soluppgång vid Turning Torso',
                'content': 'Vaknade tidigt för att fånga denna magiska morgon i Malmö. Vilken start på dagen! 🌅',
                'image': '/placeholder.svg?height=400&width=600',
                'likes': 124,
                'comments': 23,
                'shares': 12
            },
            {
                'username': 'ErikL',
                'avatar': '/placeholder.svg?height=40&width=40',
                'date': '2025-03-13T15:45:00Z',
                'title': 'Lokalt initiativ för renare stränder',
                'content': 'Idag samlade vi över 50 personer för att städa Ribersborgsstranden. Tillsammans gör vi skillnad! 💪🌊',
                'image': '/placeholder.svg?height=400&width=600',
                'video': '/placeholder.mp4',
                'likes': 89,
                'comments': 15,
                'shares': 8
            }
        ]
        
        for post_data in posts_data:
            post, created = UserPost.objects.get_or_create(
                username=post_data['username'],
                date=post_data['date'],
                title=post_data['title'],
                defaults={
                    'avatar': post_data['avatar'],
                    'content': post_data['content'],
                    'image': post_data.get('image'),
                    'video': post_data.get('video'),
                    'likes': post_data['likes'],
                    'comments': post_data['comments'],
                    'shares': post_data['shares']
                }
            )
            
            if created:
                self.stdout.write(f'Created user post: {post.title}')
        
        self.stdout.write(self.style.SUCCESS('Successfully loaded initial data!'))
