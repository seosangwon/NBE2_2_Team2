package com.example.devcoursed.domain.member.member.service;

import com.example.devcoursed.domain.member.member.Exception.MemberException;
import com.example.devcoursed.domain.member.member.Exception.MemberTaskException;
import com.example.devcoursed.domain.member.member.dto.MemberDTO;
import com.example.devcoursed.domain.member.member.entity.Member;
import com.example.devcoursed.domain.member.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;


    @Transactional
    public MemberDTO.Create create(MemberDTO.Create dto) {
        try {
            //기존의 회원이 있는지 검사
            Optional<Member> member = memberRepository.findByLoginId(dto.getLoginId());
            if (member.isPresent()) {
                throw new RuntimeException("해당 아이디로 회원가입한 회원이 존재합니다");
            }

            String password = dto.getPw();
            dto.setPw(passwordEncoder.encode(password));

            memberRepository.save(dto.toEntity());
            return dto;
        } catch (Exception e) {
            throw MemberException.MEMBER_NOT_REGISTERED.getMemberTaskException();
        }

    }

    @Transactional
    public MemberDTO.Update update(MemberDTO.Update dto) {
        Optional<Member> memberOptional = memberRepository.findById(dto.getId());

        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            member.changeLoginId(dto.getLoginId());
            member.changePw(dto.getPw());
            member.changeName(dto.getName());
            member.changeMImage(dto.getMImage());
            memberRepository.save(member);

            return new MemberDTO.Update(
                    member.getId(),
                    member.getLoginId(),
                    member.getPw(),
                    member.getName(),
                    member.getMImage()
            );
        } else {
            throw MemberException.MEMBER_NOT_MODIFIED.getMemberTaskException();
        }
    }

    @Transactional
    public void delete(Long id) {
        Optional<Member> memberOptional = memberRepository.findById(id);
        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            memberRepository.delete(member);
        } else {
            throw MemberException.MEMBER_NOT_REMOVED.getMemberTaskException();
        }
    }

    public MemberDTO.Response read(Long id) {
        Optional<Member> memberOptional = memberRepository.findById(id);
        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            return new MemberDTO.Response(
                    member.getLoginId(),
                    member.getPw(),
                    member.getName(),
                    member.getMImage(),
                    member.getCreatedAt(),
                    member.getModifiedAt()
            );
        } else {
            throw MemberException.MEMBER_NOT_REMOVED.getMemberTaskException();
        }
    }

    @Transactional
    public MemberDTO.ChangeImage changeImage(MemberDTO.ChangeImage dto) {
        Optional<Member> memberOptional = memberRepository.findById(dto.getId());
        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            member.changeMImage(dto.getMImage());
            memberRepository.save(member);

            return new MemberDTO.ChangeImage(member.getId(),member.getMImage());
        } else {
            throw MemberException.MEMBER_IMAGE_NOT_MODIFIED.getMemberTaskException();
        }
    }

    public MemberDTO.LoginResponseDto checkLoginIdAndPassword(String loginId, String pw) {
        Optional<Member> opMember = memberRepository.findByLoginId(loginId);

        if (opMember.isEmpty()) {
            throw MemberException.MEMBER_NOT_FOUND.getMemberTaskException();
        }

        if (!passwordEncoder.matches(pw, opMember.get().getPw())) {
            throw MemberException.MEMBER_LOGIN_DENIED.getMemberTaskException();
        }

        Member member = opMember.get();
        MemberDTO.LoginResponseDto responseDto = new MemberDTO.LoginResponseDto(member);

        return responseDto;


    }
}
