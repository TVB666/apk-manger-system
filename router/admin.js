'use strict';

import express from 'express'
import UserComponent from '../prototype/userBase'
const router = express.Router()

router.post('/login', UserComponent.login);

export default router
