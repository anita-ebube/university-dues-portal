import React from "react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import AdminBenefits from "../components/AdminBenefits/AdminBenefits";
import KeyFeatures from "../components/card/KeyFeatures";
const Home = () => {
  return (
    <Layout>
    <Hero />
    <KeyFeatures />
    <AdminBenefits />
    </Layout>
  );
};

export default Home;