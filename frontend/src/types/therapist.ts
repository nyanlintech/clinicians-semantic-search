export interface Approach {
    name: string;
    description?: string;
}

export interface Speciality {
    name: string;
    description?: string;
}

export interface Therapist {
    id: number;
    name: string;
    full_name: string | null;
    pronouns: string | null;
    title: string | null;
    credentials: string | null;
    status: string | null;
    intro: string | null;
    ideal_client: string | null;
    approaches: Approach[] | null;
    rate_min: string | null;
    rate_max: string | null;
    free_consultation: boolean | null;
    practicing_since: string | null;
    languages: string | null;
    services: string[] | null;
    insurance: string[] | null;
    specialities: Speciality[] | null;
    other_techniques: string[] | null;
    other_issues: string[] | null;
    url: string | null;
    image?: string;
    location?: string;
    accepting_clients?: boolean;
    telehealth?: boolean;
    in_person?: boolean;
}

export interface SearchQuery {
    query?: string;  // For backward compatibility
    criteria?: string[];  // New multi-criteria support
    insurance?: string[];
    titles?: string[];
}

export interface Filters {
    insurance: string[];
    titles: string[];
}
