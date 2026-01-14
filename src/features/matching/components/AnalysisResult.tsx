import MatchingScoreCard, { type SuitabilityInfo } from './MatchingScoreCard';
import StrengthAnalysis, { type StrengthItem } from './StrengthAnalysis';
import WeaknessAnalysis, { type WeaknessItem } from './WeaknessAnalysis';
import TechStackMatching, { type TechSkill } from './TechStackMatching';
import AIRecommendation, { type Recommendation } from './AIRecommendation';
import ActionButtons from './ActionButtons';

interface AnalysisResultProps {
  suitabilityInfo: SuitabilityInfo;
  strengths: StrengthItem[];
  weaknesses: WeaknessItem[];
  techSkills: TechSkill[];
  recommendations: Recommendation[];
  onReanalyze: () => void;
  onEditResume: () => void;
  onApply: () => void;
}

export default function AnalysisResult({
  suitabilityInfo,
  strengths,
  weaknesses,
  techSkills,
  recommendations,
  onReanalyze,
  onEditResume,
  onApply
}: AnalysisResultProps) {
  return (
    <div className="space-y-6">
      {/* 매칭 결과 카드 */}
      <MatchingScoreCard suitabilityInfo={suitabilityInfo} />

      {/* 세부 분석 */}
      <div className="grid grid-cols-2 gap-6">
        <StrengthAnalysis strengths={strengths} />
        <WeaknessAnalysis weaknesses={weaknesses} />
      </div>

      {/* 기술 스택 매칭 */}
      <TechStackMatching skills={techSkills} />

      {/* AI 추천 개선 사항 */}
      <AIRecommendation recommendations={recommendations} />

      {/* 하단 버튼 */}
      <ActionButtons 
        onReanalyze={onReanalyze}
        onEditResume={onEditResume}
        onApply={onApply}
      />
    </div>
  );
}
