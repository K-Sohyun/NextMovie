import { Movie } from "@/types/movie";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

interface CrewMember {
  job: string;
  name: string;
}

interface CastMember {
  name: string;
}

export async function fetchTmdbMovieDetails(movieId: string): Promise<Movie | null> {
  if (!API_KEY) throw new Error("⚠️ TMDb API 키가 설정되지 않았습니다.");

  try {
    const [movieRes, creditsRes] = await Promise.all([
      fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`),
      fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR`)
    ]);

    const movieData = await movieRes.json();
    const creditsData = await creditsRes.json();

    if (!movieData) return null;

    const director = creditsData.crew?.find((person: CrewMember) => person.job === "Director")?.name || "정보 없음";
    const actors = creditsData.cast?.slice(0, 5).map((actor: CastMember) => actor.name) || ["정보 없음"];

    return {
      id: movieData.id,
      title: movieData.title,
      poster_path: movieData.poster_path || "",
      release_date: movieData.release_date || "",
      overview: movieData.overview || "",
      genres: movieData.genres || [],
      director,
      actors,
    };
  } catch (error) {
    console.error("❌ TMDb 영화 상세 정보를 가져오는 중 오류 발생:", error);
    return null;
  }
}
