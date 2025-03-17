export interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  release_date?: string;
  overview?: string;
  genres?: { id: number; name: string }[]; 
  director?: string; 
  actors?: string[]; 
}

export interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  release_date: string;
  overview?: string;
  genres?: { id: number; name: string }[];
  adult: boolean;
  original_language: string;
}
