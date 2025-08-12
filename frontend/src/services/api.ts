import axios from 'axios';
import type { Therapist, SearchQuery, Filters } from '../types/therapist';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const searchTherapists = async (query: SearchQuery): Promise<Therapist[]> => {
    const requestBody = {
        criteria: query.criteria,
        insurance: query.insurance || [],
        titles: query.titles || []
    };
    
    console.log('Sending search request:', requestBody);
    
    const response = await api.post<Therapist[]>('/search', requestBody);
    return response.data;
};

export const getFilters = async (): Promise<Filters> => {
    const response = await api.get<Filters>('/filters');
    return response.data;
}; 