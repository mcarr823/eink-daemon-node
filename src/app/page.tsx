/**
 * Default website screen.
 * 
 * Explains the purpose of this tool.
 * 
 * @returns About screen
 */
export default function About() {
  return (
    <div>
      <p>
        eink-daemon-node is a tool for testing Waveshare e-ink panels.
      </p>
      <p>
        Its goal is to facilitate the following:
        <ul>
          <li>connecting to panels via USB or GPIO connection</li>
          <li>acting as a daemon through which other programs can interact with an e-ink panel</li>
          <li>provide a simple web interface for updating e-ink panels</li>
        </ul>
      </p>
      <p>
        This program is a work-in-progress and is not yet functional.
      </p>
    </div>
  );
}
