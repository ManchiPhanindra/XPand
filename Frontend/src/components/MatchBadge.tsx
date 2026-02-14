const MatchBadge = ({ score }: { score: number }) => {
  return (
    <span className="bg-green-600 px-2 py-1 rounded text-xs">
      Match {score}%
    </span>
  );
};

export default MatchBadge;
