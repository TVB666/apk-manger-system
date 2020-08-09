'use strict'

import mongoose from 'mongoose'
// mongodb 没有自加一功能
const Schema = mongoose.Schema

const idSequenceSchema = new Schema({
  id_key: String,
  sequence_value: Number,
})

idSequenceSchema.index({id_key: 1});

const IdSequenceSchema = mongoose.model('idSequenceSchema', idSequenceSchema, 'idSequence')

export default IdSequenceSchema
