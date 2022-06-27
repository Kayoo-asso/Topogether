import { RootNew } from "components";
import { User } from "types";
import {
  getUserInitialProps,
  loginRedirect,
  withRouting,
} from "helpers/server";

type BuilderNewProps = {
  user: User;
};

export default withRouting<BuilderNewProps>({
  async getInitialProps(ctx) {
    const user = await getUserInitialProps(ctx);
    if (!user) return loginRedirect("/builder/new");
    return { props: { user } };
  },

  render({ user }) {
    return <RootNew user={user} />;
  },
});
