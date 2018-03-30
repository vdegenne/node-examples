# Typescript exemple

- On installe `typescript` dans les dépendances de développement, mais aussi globalement :

```bash
yarn add typescript -D
yarn global typescript
```
(Dans un système de type *nix, il est possible qu'il soit nécessaire d'être utilisateur sudoer pour pouvoir installer un package en global).

- On crée un répertoire `src` dans lequel on place nos sources *.ts

- On init `tsc` (typescript compiler) : `tsc --init` pour générer le fichier de config `tsconfig.json`

- on édite le fichier à convenance. Par exemple les propriétés `outDir`, `sourceMap`, `removeComments` peuvent être modifiées.
- on édite aussi la propriété `include`.