import * as escapeHtml from 'escape-html';
import * as express from 'express';
import {createReadStream} from 'fs';
import * as path from 'path';
import * as send from 'send';
import * as serveIndex from 'serve-index';
import {parse as parseUrl} from 'url';

export function makeLegacyApp() {
  const app: express.Express = express();

  /**
   * Par défaut, une application express ne sert rien. Il faut lui dire
   * exactement quoi servir en utilisant les verbes HTTP, et en implémentant le
   * corps du callback.
   */
  app.get('*', (req, res) => {
    // Retourne un lorem ipsum. Attention: C'est un path relatif, ceci
    // fonctionnera si ce répertoire se trouve à l'endroit où on a lancé
    // `node
    // lib/app`, autrement dit relativement à process.cwd(). Sinon cela ne
    // fonctionnera pas.
    createReadStream('public/index.html').pipe(res);
  });

  return app;
}



export function makeApp() {
  const app: express.Express = express();

  // On définit les routes par le premier argument d'une des fonctions de
  // l'application express qui représentent les verbes HTTPs.
  app.get('/cool', (req, res) => {
    res.send('this is cool');
  });

  // On peut aussi utiliser des paramètres de route.
  app.get('/test/:id', (req, res) => {
    res.send(req.params.id);
  });

  // Et utiliser des librairies existantes pour définir certains comportements
  // par défaut. Ici on utilise le module 'serve-index' pour servir le dossier
  // publique ou le lister.
  app.use('/public', serveIndex('public'));
  app.use('/public', express.static('public'));

  return app;
}

/**
 * Si notre application est essentiellement destinée à servir des fichiers ou à
 * faire des streams. On peut utiliser le module 'send' qui facilite l'écriture
 * des fonctions et apportent d'autres fonctions intéressantes.
 */
export function makeSendApp(): express.Express {
  const app: express.Express = express();

  app.get('*', (req, res) => {
    const url = parseUrl(req.url, true).pathname;
    const trailingSlash = (url.substr(-1) === '/') ? true : false;
    const filepath = path.resolve(url.substr(1)) + (trailingSlash ? '/' : '');


    send(req, filepath)
        .on('directory',
            // Système de redirection pour éviter le listing et servir un index
            // s'il existe.
            () => {
              res.statusCode = 301;
              res.setHeader('Location', req.originalUrl + '/');
              // `end` retourne juste du texte sans qu'express essaie de
              // déterminer le "Content-type" adéquate. Utiliser surtout pour
              // les redirection qui ne demandent aucunes modifications des
              // headers ou quand aucun système de cache n'est nécessaire (e.g.
              // ETAG).
              res.end('Redirecting');
            })
        .on('error',
            (err) => {
              if (err.statusCode === 404) {
                // Gestion des "not found" manuelle.
                res.status(404);
                res.end();
              } else {
                res.status(err.statusCode);
                res.type('html');
                res.end(escapeHtml(err.Error));
              }
            })
        .pipe(res);
  });

  return app;
}
