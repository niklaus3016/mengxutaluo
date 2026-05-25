import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck } from 'lucide-react';

const PrivacyModal = ({ onAccept, onDecline, onOpenAgreement, onOpenPrivacy }: {
  onAccept: () => void,
  onDecline: () => void,
  onOpenAgreement: () => void,
  onOpenPrivacy: () => void
}) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glass w-full max-w-sm shadow-2xl max-h-[80vh] overflow-y-auto rounded-[28px] border border-white/10"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-6 text-center pt-4">
          用户协议与隐私政策
        </h3>
        <div className="mb-6">
          <p className="text-base text-white/80 mb-3">(1)《隐私政策》中关于个人设备用户信息的收集和使用的说明。</p>
          <p className="text-base text-white/80">(2)《隐私政策》中与第三方SDK类服务商数据共享、相关信息收集和使用说明。</p>
        </div>
        <div className="mb-6">
          <p className="text-sm text-white/50 mb-2">用户协议和隐私政策说明：</p>
          <p className="text-sm text-white/70">
            阅读完整的
            <span
              onClick={onOpenAgreement}
              className="text-mystic-gold hover:underline cursor-pointer font-medium mx-1"
            >
              《用户服务协议》
            </span>
            和
            <span
              onClick={onOpenPrivacy}
              className="text-mystic-gold hover:underline cursor-pointer font-medium mx-1"
            >
              《隐私政策》
            </span>
            了解详细内容。
          </p>
        </div>
      </div>
      <div className="flex border-t border-white/10">
        <button
          onClick={onDecline}
          className="flex-1 py-4 text-base font-medium text-white/60 bg-transparent border-r border-white/10 rounded-bl-[28px] hover:bg-white/5 transition-colors"
        >
          不同意
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-4 text-base font-medium text-white bg-mystic-gold/20 hover:bg-mystic-gold/30 rounded-br-[28px] transition-colors"
        >
          同意并继续
        </button>
      </div>
    </motion.div>
  </div>
);

const AgreementModal = ({ onClose, title, content }: { onClose: () => void, title: string, content: React.ReactNode }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-60">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="glass rounded-[28px] w-full max-w-3xl h-[85vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col"
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-mystic-900/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mystic-gold/20 text-mystic-gold rounded-xl flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/60 active:scale-90 transition-transform hover:bg-white/10"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-mystic-900/30 p-6">
        {content}
      </div>
    </motion.div>
  </div>
);

const PrivacyPolicyContent = () => (
  <div className="max-w-none text-white/80">
    <h1 className="text-2xl font-bold text-mystic-gold text-center mb-2">🔒 隐私政策</h1>
    <p className="text-center text-white/50 mb-6"><strong>生效日期</strong>：2026年05月25日</p>

    <div className="bg-mystic-gold/10 p-6 rounded-lg border-l-4 border-mystic-gold mb-6">
      <p className="text-white/80">欢迎使用「梦序塔罗」（以下简称"本应用"）。本应用由<strong>光年跃迁（温州）科技有限公司</strong>（以下简称"我们"）开发并运营。我们深知个人信息对您的重要性，将严格遵守《中华人民共和国个人信息保护法》等相关法律法规，保护您的个人信息安全。</p>
    </div>

    <p className="mb-6 text-white/80">本隐私政策旨在说明我们如何收集、使用、存储和保护您在使用本应用过程中提供的个人信息，以及您对这些信息所享有的权利。请您在使用本应用前仔细阅读并充分理解本政策的全部内容，尤其是加粗的条款。如您对本政策有任何疑问、意见或建议，可通过本政策末尾提供的联系方式与我们联系。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-mystic-gold">一、我们收集的信息</h2>
    <p className="mb-4 text-white/80">在您使用本应用的过程中，我们会收集以下信息，以提供、维护和改进我们的服务：</p>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-white/80"><strong>占卜查询数据</strong>：您在使用本应用过程中主动录入的所有<strong>生日信息、查询记录</strong>等。这些数据是本应用的核心功能内容，用于为您提供塔罗占卜、历史记录等服务。</li>
      <li className="mb-3 text-white/80"><strong>设备信息</strong>：为了保障应用的稳定运行和优化用户体验，我们会自动收集您的设备相关信息，包括但不限于<strong>设备型号、操作系统版本、设备标识符（如IMEI/Android ID）、IP地址</strong>等。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-mystic-gold">二、我们如何使用收集的信息</h2>
    <p className="mb-4 text-white/80">我们仅会在以下合法、正当、必要的范围内使用您的个人信息：</p>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-white/80"><strong>提供和改进服务</strong>：使用您的占卜查询数据来实现塔罗占卜、历史记录等核心功能；通过分析设备信息和使用数据，优化应用性能，修复已知问题，提升用户体验。</li>
      <li className="mb-3 text-white/80"><strong>数据分析和统计</strong>：在对您的个人信息进行匿名化或去标识化处理后，进行内部数据分析和统计，以了解用户群体的使用习惯和需求，从而更好地规划和改进产品功能。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-mystic-gold">三、我们如何共享、转让和公开披露信息</h2>
    <p className="mb-4 text-white/80">我们郑重承诺，严格保护您的个人信息，不会在以下情形之外向任何第三方共享、转让或公开披露您的信息：</p>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-white/80"><strong>法定情形</strong>：根据法律法规的规定、行政或司法机关的强制性要求，我们可能会向有关部门披露您的相关信息。</li>
      <li className="mb-3 text-white/80"><strong>获得明确同意</strong>：在获得您的明确书面同意后，我们才会向第三方共享您的个人信息。</li>
      <li className="mb-3 text-white/80"><strong>业务必要且合规</strong>：为了实现本政策第二条所述的目的，我们可能会与提供技术支持、支付服务或其他必要服务的合作伙伴共享必要的信息，但我们会要求其严格遵守本政策及相关法律法规，并对您的信息承担保密义务。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-mystic-gold">四、我们如何存储和保护信息</h2>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-white/80"><strong>存储地点和期限</strong>：您的个人信息将存储于中华人民共和国境内的安全服务器上。我们会在实现本政策所述目的所必需的最短时间内保留您的信息，超出此期限后，我们将对您的信息进行删除或匿名化处理。</li>
      <li className="mb-3 text-white/80"><strong>安全措施</strong>：我们采用符合行业标准的技术手段和安全管理措施来保护您的个人信息，包括但不限于数据加密、访问控制、安全审计等，以防止信息泄露、丢失、篡改或被未经授权的访问。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-mystic-gold">五、您的权利</h2>
    <p className="mb-4 text-white/80">根据相关法律法规，您对您的个人信息享有以下权利：</p>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-white/80"><strong>访问权</strong>：您可以随时在本应用中查看和管理您的查询历史记录。</li>
      <li className="mb-3 text-white/80"><strong>删除权</strong>：您可以随时删除查询历史记录，应用将立即删除相关数据。</li>
      <li className="mb-3 text-white/80"><strong>数据导出</strong>：本应用所有数据存储在您的设备本地，您可以通过设备备份等方式导出您的数据。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-mystic-gold">六、未成年人保护</h2>
    <p className="mb-6 text-white/80">我们非常重视对未成年人个人信息的保护。如您是未满14周岁的未成年人，在使用本应用前，应在监护人的指导下仔细阅读本政策，并征得监护人的同意。如我们发现自己在未事先获得监护人可验证同意的情况下收集了未成年人的个人信息，将立即删除相关数据。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-mystic-gold">七、本政策的更新</h2>
    <p className="mb-6 text-white/80">我们可能会根据法律法规的更新、业务的调整或技术的发展，适时对本隐私政策进行修订。修订后的政策将在本应用内显著位置公示，并在生效前通过合理方式通知您。如您继续使用本应用，即表示您同意接受修订后的政策。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-mystic-gold">八、联系我们</h2>
    <p className="mb-4 text-white/80">如您对本隐私政策有任何疑问、意见或建议，或需要行使您的相关权利，请通过以下方式与我们联系：</p>
    <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-6">
      <p className="text-white/80"><strong>电子邮箱</strong>：Jp112022@163.com</p>
    </div>

    <div className="mt-8 pt-6 border-t border-white/10 text-center">
      <p className="mb-2 text-white/50">感谢您使用梦序塔罗！</p>
      <p className="mb-4 text-white/50">我们致力于为您提供安全、便捷的塔罗占卜服务。</p>
      <p className="text-sm text-white/40">© 2026 光年跃迁（温州）科技有限公司 版权所有</p>
    </div>
  </div>
);

const UserAgreementContent = () => (
  <div className="max-w-none text-white/80">
    <h1 className="text-2xl font-bold text-mystic-gold text-center mb-4">用户服务协议</h1>
    <p className="text-center text-white/50 mb-8">更新日期：2026年05月25日</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-mystic-gold">1. 协议的接受</h2>
    <p className="mb-4">欢迎使用「梦序塔罗」应用（以下简称「本应用」）。</p>
    <p className="mb-4">本协议是您与梦序塔罗开发团队（以下简称「我们」）之间关于使用本应用的法律协议。</p>
    <p className="mb-4">通过下载、安装或使用本应用，您表示同意接受本协议的全部条款和条件。</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-mystic-gold">2. 服务内容</h2>
    <p className="mb-4">本应用提供以下服务：</p>
    <ul className="list-disc pl-6 space-y-2 mb-6">
      <li>塔罗牌占卜与解读</li>
      <li>个人星盘解读</li>
      <li>塔罗牌库浏览与学习</li>
      <li>占卜历史记录管理</li>
    </ul>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-mystic-gold">3. 用户义务</h2>
    <p className="mb-4">作为本应用的用户，您同意：</p>
    <ul className="list-disc pl-6 space-y-2 mb-6">
      <li>遵守本协议的所有条款</li>
      <li>不使用本应用进行任何非法活动</li>
      <li>不干扰本应用的正常运行</li>
      <li>保护您的设备安全，防止未授权访问</li>
    </ul>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-mystic-gold">4. 知识产权</h2>
    <p className="mb-4">本应用的所有内容，包括但不限于文字、图像、音频、视频、软件等，均受知识产权法律保护。</p>
    <p className="mb-4">未经我们的书面许可，您不得复制、修改、分发或商业使用本应用的任何内容。</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-mystic-gold">5. 免责声明</h2>
    <p className="mb-4">本应用按「原样」提供，不做任何形式的保证。</p>
    <p className="mb-4">我们不保证：</p>
    <ul className="list-disc pl-6 space-y-2 mb-6">
      <li>本应用将符合您的要求</li>
      <li>本应用将无中断、及时、安全或无错误地运行</li>
      <li>本应用的使用结果将是准确或可靠的</li>
    </ul>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-mystic-gold">6. 隐私保护</h2>
    <p className="mb-4">本应用所有数据均在您的设备本地处理和存储，不会上传至任何服务器。</p>
    <p className="mb-4">我们重视您的隐私，并采取合理措施保护您的个人信息安全。</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-mystic-gold">7. 终止</h2>
    <p className="mb-4">我们有权在任何时候，出于任何原因，终止或暂停您对本应用的访问。</p>
    <p className="mb-4">您也可以随时停止使用本应用。</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-mystic-gold">8. 适用法律</h2>
    <p className="mb-4">本协议受中华人民共和国法律管辖。</p>
    <p className="mb-4">任何与本协议相关的争议，应通过友好协商解决；协商不成的，应提交至有管辖权的人民法院诉讼解决。</p>
    
    <div className="mt-8 pt-6 border-t border-white/10 text-center">
      <p className="text-sm text-white/40">© 2026 梦序塔罗 版权所有</p>
    </div>
  </div>
);

const DeclineConfirmModal = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-60">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="glass rounded-[28px] w-full max-w-md overflow-hidden shadow-2xl border border-white/10 flex flex-col"
    >
      <div className="flex-1 p-6">
        <h2 className="text-xl font-bold text-white mb-4">确认拒绝</h2>
        <p className="text-white/60 mb-6">您确定要拒绝隐私政策吗？拒绝后将无法使用我们的服务。</p>
      </div>
      <div className="flex border-t border-white/10">
        <button
          onClick={onCancel}
          className="flex-1 py-4 text-center text-white/60 font-medium hover:bg-white/5 transition-colors"
        >
          取消
        </button>
        <div className="w-px bg-white/10"></div>
        <button
          onClick={onConfirm}
          className="flex-1 py-4 text-center text-mystic-gold font-medium hover:bg-white/5 transition-colors"
        >
          确定
        </button>
      </div>
    </motion.div>
  </div>
);

export {
  PrivacyModal,
  AgreementModal,
  PrivacyPolicyContent,
  UserAgreementContent,
  DeclineConfirmModal
};
