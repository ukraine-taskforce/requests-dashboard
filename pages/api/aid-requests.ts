// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { aidRequestsFixture } from "./aid-request.fixture";

type AidRequest = {
  properties: {
    mag: number;
    description: string;
    date: string;
  };
  geometry: { type: string; coordinates: number[] };
}[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AidRequest>
) {
  res.status(200).json(aidRequestsFixture);
}
