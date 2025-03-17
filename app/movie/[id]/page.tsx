import Image from "next/image";
import Link from "next/link";
import { fetchTmdbMovieDetails } from "@/lib/fetchTmdbDetails";
import { fetchTmdbPopularMovies } from "@/lib/fetchTmdbPopular";
import { Movie } from "@/types/movie";
import styles from "@/styles/Detail.module.scss";

// 정적 페이지 생성 (SSG 적용)
export async function generateStaticParams() {
  const movies = await fetchTmdbPopularMovies();
  return movies.map((movie) => ({ id: movie.id.toString() })); // ID를 문자열로 변환
}

// params를 Promise<{ id: string }>으로 설정
export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) { 
  const { id } = await params; // await 사용하여 params 추출
  const movie: Movie | null = await fetchTmdbMovieDetails(id);

  if (!movie) {
    return <p>영화를 찾을 수 없습니다.</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{movie.title}</h1>
        <Image 
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-image.png"}
          alt={movie.title}
          width={500}
          height={750}
        />
        <ul className={styles.info}>
          <li><strong>🎬 감독</strong> {movie.director || "정보 없음"}</li>
          <li><strong>📽️ 장르</strong> {movie.genres?.map((g) => g.name).join(", ") || "정보 없음"}</li>
          <li><strong>🧒 출연 배우</strong> {movie.actors?.join(", ") || "정보 없음"}</li>
          <li><strong>📝 줄거리</strong> {movie.overview || "줄거리 없음"}</li>
        </ul>

        <Link href="/" className={styles.backButton}>Back</Link>
      </div>
    </div>
  );
}