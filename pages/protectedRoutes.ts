import { api, auth } from "helpers/services";
import { NextRouter } from 'next/router';

//check if you are on the client (browser) or server
const isBrowser = () => typeof window !== "undefined";

const ProtectedRoute = ({ router, children }: { router: NextRouter, children: JSX.Element }) => {
  //Identify authenticated user
  const user = auth.session();
  const isAuthenticated = !!user;

  let unprotectedRoutes = [
    '/user/login',
    '/user/signup',
    '/user/forgotPassword',
    '/',
    '/topo/[id]'
  ];

  /**
   * @var pathIsProtected Checks if path exists in the unprotectedRoutes routes array
   */
  let pathIsProtected = router ? unprotectedRoutes.indexOf(router.pathname) === -1 : true;

  if (isBrowser() && !isAuthenticated && pathIsProtected) {
    router.push('/user/login');
  }
 
  return children || null;
};

export default ProtectedRoute;