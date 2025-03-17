import { Movie, TmdbMovie } from "@/types/movie";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchTmdbPopularMovies(): Promise<Movie[]> {
  // ✅ `discover/movie`를 사용하여 한국 영화만 가져오기
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko-KR&include_adult=false&with_original_language=ko&sort_by=popularity.desc`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log("🔍 TMDb API 응답:", data.results); // ✅ API 응답 확인

    if (!Array.isArray(data.results)) {
      console.error("❌ API 응답이 올바르지 않음:", data);
      return [];
    }

    // ✅ 한국 영화 필터링 (한글 제목 필터는 제거)
    const filteredMovies = data.results.filter((movie: TmdbMovie) =>
      movie.poster_path !== null // 🔹 포스터 없는 영화 제외
    );

    return filteredMovies.map((movie: TmdbMovie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path || "",
      release_date: movie.release_date || "",
      overview: movie.overview || "",
      genres: movie.genres || [],
    }));
  } catch (error) {
    console.error("❌ 한국 인기 영화 데이터를 불러오는 중 오류 발생:", error);
    return [];
  }
}
