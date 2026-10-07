import { useState } from 'react';
import { Icon } from './Icon';
import { Modal } from './ui/Modal';

export function FeedbackModal({ open, onClose, onSend, t }){
  const [txt,setTxt]=useState('');
  if (!open) return null;
  return (
    <Modal open onClose={onClose} maxW="max-w-sm">
      <form className="modal-card" onSubmit={e=>{ e.preventDefault(); if(!txt.trim()) return; onSend(txt); setTxt(''); }}>
        <div className="flex items-start justify-between">
          <div><div className="eyebrow">رأيك</div><h3 className="text-xl font-bold text-txt mt-1">{t('fb.title')}</h3></div>
          <button type="button" onClick={onClose} className="ibtn" aria-label={t('co.close')}><Icon name="x" size={17}/></button>
        </div>
        <textarea className="inp mt-4" value={txt} onChange={e=>setTxt(e.target.value)} placeholder={t('fb.hint')}/>
        <button type="submit" className="btn-primary w-full h-11 mt-4"><Icon name="send" size={15}/>{t('fb.submit')}</button>
      </form>
    </Modal>
  );
}
