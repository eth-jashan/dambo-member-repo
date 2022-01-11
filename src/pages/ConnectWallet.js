export default function Onboarding() {
  return (
    <div>
      <Layout decreaseStep={decreaseStep}>
        {getComponentFromStep(currentStep, hasMultiSignWallet)}
      </Layout>
    </div>
  );
}
