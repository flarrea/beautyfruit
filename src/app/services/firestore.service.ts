import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  createDoc(data: any, path: string, id: string) {
    const collection = this.firestore.collection(path);

    return collection.doc(id).set(Object.assign({}, data));
  }

  getId() {
    return this.firestore.createId();
  }
}
