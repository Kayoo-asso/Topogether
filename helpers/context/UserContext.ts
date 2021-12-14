import React, { Dispatch, SetStateAction } from 'react';
import { User } from 'types';

type UserContext = {
  session: User | null,
  setSession: Dispatch<SetStateAction<User>> | null,
};

export const UserContext = React.createContext<UserContext>({
  session: null,
  setSession: null,
});
