from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import View
from django.http import HttpResponse
import os

# View to serve the React app
class ReactAppView(View):
    def get(self, request, *args, **kwargs):
        try:
            with open(os.path.join(settings.REACT_APP_DIR, 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse(
                """
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="utf-8">
                        <title>GLADSTART</title>
                    </head>
                    <body>
                        <h1>Backend server is running!</h1>
                        <p>But the React app is not built or not found.</p>
                        <p>Please make sure to run <code>npm run build</code> in the frontend directory.</p>
                    </body>
                </html>
                """,
                status=200,
                content_type='text/html'
            )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# At the bottom of the file
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # Serve React app in production
    urlpatterns.append(re_path(r'^.*$', ReactAppView.as_view(), name='react-app'))
