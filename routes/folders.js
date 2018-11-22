const express = require('express');
const knex = require('../knex');
// Create an router instance (aka "mini-app")
const router = express.Router();

router.get('/', (req, res, next) => {
    knex
      .select('id', 'name')
      .from('folders')
      .orderBy('folders.id')
      .then(results => {
        console.log(results);
        res.json(results);
      })
      .catch(err => next(err));
  });

  router.get('/:id', (req, res, next) => {

    knex
    .select('id', 'name')
    .from('folders')
    .where('id', req.params.id) 
    .then((folder) => {
     if(folder != undefined){
      console.log(folder); 
      res.json(folder)
    } 
    else{
      next(); 
    }
    })
    .catch(err => {
      next(err);
    });
  });

  router.put('/:id', (req, res, next) => {
    const id = req.params.id;
  
    /***** Never trust users - validate input *****/
    const updateObj = {};
    const updateableFields = ['id', 'name'];
  
    updateableFields.forEach(field => {
      if (field in req.body) {
        updateObj[field] = req.body[field];
      }
    });
  
    /***** Never trust users - validate input *****/
    if (!updateObj.name) {
      const err = new Error('Missing `name` in request body');
      console.log(err); 
      err.status = 400;
      return next(err);
    }
  
    knex('folders')
    .select('id, name')
    .where('id',id)
    .update(updateObj)
    .then(newFolder => {
      console.log(newFolder); 
      if(newFolder){
        return res.sendStatus(204);
      }
      else{
        next();
      }
    })
    .catch(err => next(err)); 
  });

  router.post('/', (req, res, next) => {
    const { name, id } = req.body;
  
    const newItem = { name, id };
    /***** Never trust users - validate input *****/
    if (!newItem.name) {
      const err = new Error('Missing `name` in request body');
      err.status = 400;
      return next(err);
    }
  
    // notes.create(newItem)
    //   .then(item => {
    //     if (item) {
    //       res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    //     }
    //   })
    //   .catch(err => {
    //     next(err);
    //   });

    knex
    .insert(req.body)
    .into('folders')
    .returning('*')
    .then(([updatedObject]) =>{
        console.log(updatedObject); 
        if(updatedObject){
            return res.json(updatedObject);
        }
        next(); 
    })
    .catch(err => next(err)); 
}); 

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
  
    // notes.delete(id)
    //   .then(() => {
    //     res.sendStatus(204);
    //   })
    //   .catch(err => {
    //     next(err);
    //   });
    knex('folders') 
      .select('*')
      .where('id',id)
      .delete()
      .then(() => {
        res.sendStatus(204);
      })
      .catch(err => { 
        next(err)
      });
  });

  module.exports = router;