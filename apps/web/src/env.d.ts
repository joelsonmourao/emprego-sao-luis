/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    auth: import("./lib/auth").AdminIdentity | null;
    candidate: import("./lib/candidate-auth").CandidateIdentity | null;
  }
}
