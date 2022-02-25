import { ReactNode } from 'react';
import { api } from "helpers/services/ApiService";
import { NextRouter } from 'next/router';

//check if you are on the client (browser) or server
const isBrowser = () => typeof window !== "undefined";

const ProtectedRoute = ({ router, children }: { router: NextRouter, children: ReactNode }) => {
  return null;
};

export default ProtectedRoute;