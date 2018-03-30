import { Contact, addressBook } from './addressBook';

export async function run() {
    
    let contact: Contact = {
        name: 'Jon Snow',
        email: 'jon.snow@north.com',
        id: '84574R0'
    }
    
    addressBook.push(contact);

    console.log(addressBook);
}