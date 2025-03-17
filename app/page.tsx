"use client";
import { useState, useEffect } from "react";
import { fetchTmdbPopularMovies } from "@/lib/fetchTmdbPopular";
import { fetchTmdbSearchMovies } from "@/lib/fetchTmdbSearch";
import { Movie } from "@/types/movie";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Home.module.scss";

export default function HomePage() {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // 초기 인기 영화 가져오기
  useEffect(() => {
    async function loadPopularMovies() {
      setLoading(true);
      try {
        const popularMovies = await fetchTmdbPopularMovies();
        setMovies(popularMovies);
      } catch (err) {
        console.error("❌ 인기 영화 로드 오류:", err);
        setError("인기 영화를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    loadPopularMovies();
  }, []);

  // 검색 실행 함수
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setIsSearching(true);

    try {
      const results = await fetchTmdbSearchMovies(query);
      setMovies(results);
    } catch (err) {
      console.error("❌ 검색 오류:", err);
      setError("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 뒤로 가기 버튼 클릭 시 인기 영화 다시 로드
  const handleBack = async () => {
    setLoading(true);
    setError(null);
    setIsSearching(false);
    try {
      const popularMovies = await fetchTmdbPopularMovies();
      setMovies(popularMovies);
    } catch (err) {
      console.error("❌ 인기 영화 로드 오류:", err);
      setError("인기 영화를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>🎬 인기 영화</h1>

      {/* 검색 바 */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="영화 제목을 검색하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "검색 중..." : "검색"}
        </button>
      </div>

      {/* 뒤로 가기 버튼 (검색 후 표시) */}
      {isSearching && (
        <button onClick={handleBack} className={styles.homeButton}>← 홈으로 이동</button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul className={styles.movieList}>
        {movies.length === 0 && !loading && <p>영화를 찾을 수 없습니다.</p>}
        {movies.map((movie) => (
          <li key={movie.id} className={styles.movieItem}>
            <Link href={`/movie/${movie.id}`} className={styles.link}>
              <span className={styles.imgBox}>
                <Image
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-image.png"}
                  alt={movie.title}
                  width={500}
                  height={750} 
                />
              </span>
              <h2 className={styles.title}>{movie.title} ({movie.release_date?.split("-")[0] || "연도 정보 없음"})</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
