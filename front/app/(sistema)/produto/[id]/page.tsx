export function generateStaticParams() {
  return [{ id: '1' }];
}

import ProdutoClient from "./ProdutoClient";

export default function Page() {
  return <ProdutoClient />;
}