'use strict';

import express from 'express'
import UserComponent from '../prototype/userBase'
const router = express.Router()

router.post('', UserComponent.login);

export default router
