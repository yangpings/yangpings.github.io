import { useState } from 'react';
export default function Evaluation({ complete }: { complete: () => void }) {
  const [answer, setAnswer] = useState<number>();
  return <><p>A fictional model scores 94% on a familiar test. Which next step gives you the strongest evidence that it works beyond that test?</p><div className="activity-options">{['Ship it. 94% is an A.', 'Test on a new cohort and inspect disagreement with experts.', 'Ask the model whether it feels confident.'].map((label, i) => <button key={label} aria-pressed={answer === i} onClick={() => { setAnswer(i); if (i === 1) complete(); }}>{label}</button>)}</div><p className="activity-feedback" role="status">{answer === undefined ? 'Hint: High scores can still hide some failures.' : answer === 1 ? "Exactly. Internal validation doesn't mean agreement from external sources." : 'Confidence is not evidence of generalization. Try again.'}</p></>;
}

