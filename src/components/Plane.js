// Ground or plot of land which we will creating using `three.js` library components as shown below...

const Plane = () => {
  return (
    // below is the x, y, z positions on this 3d plane with its width, height given in the next line
    <mesh position={[0, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[50, 50]} />
      <meshStandardMaterial color={"#404040"} />
    </mesh>
  );
};

export default Plane;
