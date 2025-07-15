"use client";



import { NavigateToResource } from "@refinedev/nextjs-router";
import { Authenticated } from "@refinedev/core";

export default function IndexPage() {
  return (
    <Authenticated key="home">
        <NavigateToResource />
    </Authenticated>
  )
}