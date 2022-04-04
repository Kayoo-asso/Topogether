import { PROPERTY_TYPES } from "@babel/types";
import { GetServerSideProps, GetServerSidePropsResult, Redirect } from "next";
import { Role, User, UUID } from "types";
import { getServerUser } from "./getServerUser";

export const AccessTokenCookie = "topogether-access";
export const RefreshTokenCookie = "topogether-refresh";

// Contains more, but we only need those
export type AccessJWT = {
  sub: UUID, // UUID
  exp: number, // expiry date, in seconds
  email: string,
  user_metadata: { role: Role }
}

export const jwtDecoder = (jwt: string) =>
  JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString('utf8'));

const isNotFound = <P>(props: GetServerSidePropsResult<P>): props is { notFound: true } => {
  return (props as any).notFound === true;
}
const isRedirect = <P>(props: GetServerSidePropsResult<P>): props is { redirect: Redirect } => {
  return (props as any).redirect !== undefined;
}

const isPromise = (x: any): x is Promise<unknown> => {
  return !!x && (typeof x === 'object' || typeof x === 'function') && typeof x.then === 'function';
}

export function withAuth<P>(getServerSideProps: GetServerSideProps<P>, redirect: string = "/"): GetServerSideProps<P & { user: User }> {
  return async (ctx) => {
    const user = await getServerUser(ctx.req.cookies);
    if (!user) {
      return {
        redirect: {
          destination: `/user/login?redirectTo=${redirect}`,
          permanent: false
        }
      };
    }
    const output = await getServerSideProps(ctx);
    if (isNotFound(output) || isRedirect(output)) return output;
    const props = isPromise(output.props) ? await output.props : output.props;
    return {
      props: {
        ...props,
        user
    } };
  };
}