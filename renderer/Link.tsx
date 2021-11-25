import React from "react";

export { Link };

function Link(props: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return <a {...props} />;
}
