import { Container } from "@blocks/Container.tsx";

export const NotFound = () => {
  return (
    <Container>
      <div
        className="
      self-center
      mt-12 flex-1 flex flex-col justify-center items-center
      "
        id="404"
      >
        <h1 className="font-bold text-9xl text-orange-600">404</h1>
        <h2 className="font-medium text-gray-700 italic text-lg">
          Whatcha tryna find here, Willie?
        </h2>
        <h3 className="mt-6 text-orange-800 text-right self-end">
          <a href="/">Nothing</a>
        </h3>
      </div>
    </Container>
  );
};
