import axios from 'axios';
import type { SearchQuery, Filters, Therapist } from '../types/therapist';

const rawApiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '').endsWith('/api/v1')
    ? rawApiBaseUrl.replace(/\/+$/, '')
    : `${rawApiBaseUrl.replace(/\/+$/, '')}/api/v1`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export class SearchRequestError extends Error {
    status?: number;
    code?: string;

    constructor(message: string, options?: { status?: number; code?: string }) {
        super(message);
        this.name = 'SearchRequestError';
        this.status = options?.status;
        this.code = options?.code;
    }
}

export const searchTherapists = async (query: SearchQuery): Promise<Therapist[]> => {
    const requestBody = {
        criteria: query.criteria,
        insurance: query.insurance || [],
        titles: query.titles || [],
    };

    try {
        const response = await api.post<Therapist[]>('/search', requestBody);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const code = error.code;

            if (!error.response) {
                throw new SearchRequestError(
                    'Unable to reach the search service. Please check that the backend is running and try again.',
                    { code }
                );
            }

            throw new SearchRequestError(
                `Search failed with status ${status ?? 'unknown'}. Please try again.`,
                { status, code }
            );
        }

        throw new SearchRequestError('Search failed unexpectedly. Please try again.');
    }
};

export const getFilters = async (): Promise<Filters> => {
    const response = await api.get<Filters>('/filters');
    return response.data;
}; 
