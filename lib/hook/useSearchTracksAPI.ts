import useSWR from "swr";

const fetcher = (url: string, searchWord: string) =>
  fetch(
    url +
      "?" +
      new URLSearchParams({
        word: searchWord,
      })
  ).then(async (res) => JSON.parse(await res.text()));
const useSearchTracksApi = (param) => {
  const { searchWord } = param;
  const { data, error, isValidating, mutate } = useSWR(
    searchWord.length > 0 ? ["/api/spotify/track", searchWord] : null,
    fetcher,
    { shouldRetryOnError: false }
  );
  return { data, isValidating, mutate };
};

export default useSearchTracksApi;
