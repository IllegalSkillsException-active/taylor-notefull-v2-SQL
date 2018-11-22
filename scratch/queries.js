'use strict';

const knex = require('../knex');

let searchTerm = 'random';
knex
  .select('notes.id', 'title', 'content')
  .from('notes')
  .modify(queryBuilder => {
    if (searchTerm) {
      queryBuilder.where('title', 'like', `%${searchTerm}%`);
    }
  })
  .orderBy('notes.id')
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch(err => {
    console.error(err);
  });

let searchID = 1003;

knex
  .select('notes.id', 'title', 'content')
  .from('notes')
  .where('id', `${searchID}`) 
  .then(([results]) => {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch(err => {
    console.error(err);
  }); 

knex('notes')
  .where('id', 1003)
  .update({
    title:'new title for update', 
    content: 'some new content'
  });


let newObject = { 
  title: 'newly insterted object title', 
  content: 'some fancy pancy party pants.'
};
knex
  .insert(newObject)
  .into('notes')
  .returning(['*'])
  .then(([createdObject]) => console.log(createdObject)); 

  knex 
    .select('notes.id')
    .from('notes')
    .where('id', '<', 50)
    .delete()
    .then(console.log('204'));

    
    

  
  
