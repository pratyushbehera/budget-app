import { useState, useEffect } from "react";
import gravatarUrl from "gravatar-url";

export const useGravatar = (email, options = {}) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { size = 80, defaultType = "retro", checkExistence = false } = options;

  useEffect(() => {
    const getGravatar = async () => {
      if (!email) {
        setAvatarUrl(null);
        setLoading(false);
        return;
      }

      try {
        const url = gravatarUrl(email, { size, default: defaultType });

        if (checkExistence) {
          const exists = await checkGravatarExists(url);
          setAvatarUrl(exists ? url : null);
        } else {
          setAvatarUrl(url);
        }
      } catch (err) {
        setError(err.message);
        setAvatarUrl(null);
      } finally {
        setLoading(false);
      }
    };

    getGravatar();
  }, [email, size, defaultType, checkExistence]);

  const checkGravatarExists = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  };

  return { avatarUrl, loading, error };
};
