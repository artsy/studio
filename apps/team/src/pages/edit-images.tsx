import { GetServerSideProps } from "next";
import { authorizedPage } from "libs/auth";
import { urlFromReq } from "libs/utils";
import { Flex, Box, Avatar } from "@artsy/palette";
import { AvatarFallback } from "components/AvatarFallback";
import { useState } from "react";
import { ImageCacheModel } from "utils/models";

export const getServerSideProps: GetServerSideProps = authorizedPage(
  async (ctx, fetch) => {
    const res = await fetch(`${urlFromReq(ctx.req)}/api/image/list`);
    if (!res.ok) {
      return { props: { errorCode: res.status, errorMessage: res.statusText } };
    }
    return { props: { cache: await res.json() } };
  }
);

export const EditImages = ({ cache }: { cache: ImageCacheModel[] }) => {
  const [deleted, setDeleted] = useState<string[]>([]);
  return (
    <Flex flexWrap="wrap">
      {cache
        .filter(({ id }) => !deleted.includes(id))
        .map(({ id, imageUrl }: any) => (
          <Box
            title={imageUrl}
            key={id}
            m={1}
            style={{
              borderRadius: "100px",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={async () => {
              const res = await fetch(
                `http://localhost:3000/api/image/delete?id=${id}`
              );
              if (res.status === 200) {
                setDeleted(deleted.concat(id));
              }
            }}
          >
            <Avatar
              lazyLoad
              src={imageUrl}
              renderFallback={({ diameter }) => (
                <AvatarFallback diameter={diameter} />
              )}
            />
          </Box>
        ))}
    </Flex>
  );
};

export default EditImages;
