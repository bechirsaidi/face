import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseProvider {

  constructor(private sqlite: SQLite) { }

  /**
   */
  public getDB() {
    return this.sqlite.create({
      name: 'products.db',
      location: 'default'
    });
  }

  /**
   */
  public createDatabase() {
    return this.getDB()
      .then((db: SQLiteObject) => {

        this.createTables(db);

        this.insertDefaultItems(db);

      })
      .catch(e => console.log(e));
  }

  /**
   * @param db
   */
  private createTables(db: SQLiteObject) {
    db.sqlBatch([
      ['CREATE TABLE IF NOT EXISTS categories (id integer primary key AUTOINCREMENT NOT NULL, name TEXT)'],
      ['CREATE TABLE IF NOT EXISTS products (id integer primary key AUTOINCREMENT NOT NULL, name TEXT, price REAL,phone integer,adresse TEXT,description TEXT,  duedate DATE, active integer, category_id integer, FOREIGN KEY(category_id) REFERENCES categories(id))']
    ])
      .then(() => console.log('table est creé'))
      .catch(e => console.error('Erreur lors de la création des tables', e));
  }

  /**
   * @param db
   */
  private insertDefaultItems(db: SQLiteObject) {
    db.executeSql('select COUNT(id) as qtd from categories', [])
    .then((data: any) => {
      if (data.rows.item(0).qtd == 0) {

        db.sqlBatch([
          ['insert into categories (name) values (?)', ['Appartements']],
          ['insert into categories (name) values (?)', ['Vétements']],
          ['insert into categories (name) values (?)', ['Voitures']]
        ])
          .then(() => console.log('Données standard incluses'))
          .catch(e => console.error('Erreur lors de l ajout de données standard', e));

      }
    })
    .catch(e => console.error('Erreur lors de l interrogation de la quantité de catégorie', e));
  }
}