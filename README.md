# WebInvestigador

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Dependency with web-tesis

This project reuses the login module of web-tesis project. Please checkout web-tesis.git, and start it in different port eg `ng serve --port 4201`, then modify the LOGIN_URL property in app-config-props.ts file to point to web-tesis login module eg. `http://localhost:4201/login`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

- If deploying on Apache HTTP Server we need to enable rewrite module (in linux: sudo a2enmod rewrite) <br/>
- Then we need to change AllowOverride in apache config file (httpd.conf or apache.conf)
<Directory /var/www/>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
</Directory>


<br/>and finally add this file under same build dir (eg. /var/www/html/sistema_investigacion/.htaccess). Needs to be named .htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d

    RewriteRule ^.*$ - [NC,L]
    RewriteRule ^(.*) index.html [NC,L]
</IfModule>

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## Renew TinyMCE API KEY

Sometimes when you go any editor and the TinyMCE editor doesn't show up. It is because you need to update API Key in use.
To update: Get a new API Key by registering for free in https://www.tiny.cloud<br/>
Then update the new API Key in content-editor.component.html
