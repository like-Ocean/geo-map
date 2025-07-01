import { nominatimApiPath } from '@renderer/constants/api';
import axios from 'axios';

export const nominatimApi = axios.create({ baseURL: nominatimApiPath });
