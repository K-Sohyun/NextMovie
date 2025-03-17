import { Movie, TmdbMovie } from "@/types/movie"; 

export async function fetchTmdbSearchMovies(query: string): Promise<Movie[]> {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!query.trim()) return [];
  const encodedQuery = encodeURIComponent(query.trim());

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodedQuery}&language=ko-KR&include_adult=false`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!Array.isArray(data.results)) {
      console.error("❌ 검색 API 응답이 올바르지 않음:", data);
      return [];
    }

    const filteredMovies = data.results.filter((movie: TmdbMovie) => 
      !movie.adult &&
      movie.poster_path !== null &&
      !["성인", "에로", "AV", "19금", "포르노", "섹스", "사정", "스캔들", "그녀", "여직원"].some((word) =>
        movie.title.toLowerCase().includes(word.toLowerCase()) ||
        movie.original_title.toLowerCase().includes(word.toLowerCase())
      )
    );

    return filteredMovies;
  } catch (error) {
    console.error("❌ 영화 검색 중 오류 발생:", error);
    return [];
  }
}
