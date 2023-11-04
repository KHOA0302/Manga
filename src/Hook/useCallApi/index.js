import { useEffect } from "react";
import axios from "axios";

function useCallApi(setState, page, api) {
  useEffect(() => {
    axios
      .get(api, {
        params: { page: page },
      })
      .then((response) => {
        const mangas = response.data.comics;
        setState(mangas);
      })
      .catch((error) => {
        console.log(error);
      });
    return;
  }, [page]);
}

export default useCallApi;
