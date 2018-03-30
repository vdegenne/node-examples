// On met généralement les interfaces en début de module,
// et on les export de manière à les rendre accessible aux autres
// modules qui les exploitent.
export interface Contact {
    name: string,
    email: string,
    id: string
}

// Pas vraiment recommandé, on crée généralement des helpers,
// c'est à dire des fonctions qui encapsulent la logique du module
// et qui modifie les objets internes au module.
export var addressBook: Contact[] = [];

