'use client';

import { Amplify } from 'aws-amplify';
import awsmobile from '../aws-exports.js';

// Configure Amplify with the real AWS configuration
Amplify.configure(awsmobile);

export default awsmobile;