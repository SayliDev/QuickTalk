const LoginPage = () => {
  return (
    <section className="bg-base-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-base-200 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center">Connexion</h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input input-bordered w-full mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input input-bordered w-full mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="checkbox checkbox-primary mr-2"
              />
              <span className="text-sm">Se souvenir de moi</span>
            </label>
            <a href="#" className="text-sm text-primary hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
          <div>
            <button type="submit" className="btn btn-primary w-full">
              Se connecter
            </button>
          </div>
        </form>
        <p className="text-sm text-center">
          Pas encore de compte ?{" "}
          <a href="#" className="text-primary hover:underline">
            S&#39;inscrire
          </a>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
