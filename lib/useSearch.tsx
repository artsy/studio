import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { normalizeSearchTerm } from "./url";

export const useSearch = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(router.query.search || "");
  useEffect(() => {
    const updateSearchTerm = url => {
      const term =
        new URL("http://noop/" + url).searchParams.get("search") ?? "";
      console.log("calling for", url, "with search", term);
      setSearchTerm(normalizeSearchTerm(term));
    };
    Router.events.on("routeChangeStart", updateSearchTerm);
  }, []);

  return searchTerm;
};
