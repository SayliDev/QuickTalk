// Fonction pour tronquer une chaîne de caractères
export const truncate = (str, maxlength) => {
  if (str.length > maxlength) {
    return str.slice(0, maxlength) + "...";
  }

  return str;
};
